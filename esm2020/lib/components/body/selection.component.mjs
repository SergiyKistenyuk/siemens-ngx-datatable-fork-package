import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionType } from '../../types/selection.type';
import { selectRows, selectRowsBetween } from '../../utils/selection';
import { Keys } from '../../utils/keys';
import * as i0 from "@angular/core";
export class DataTableSelectionComponent {
    constructor() {
        this.activate = new EventEmitter();
        this.select = new EventEmitter();
    }
    selectRow(event, index, row) {
        if (!this.selectEnabled) {
            return;
        }
        const chkbox = this.selectionType === SelectionType.checkbox;
        const multi = this.selectionType === SelectionType.multi;
        const multiClick = this.selectionType === SelectionType.multiClick;
        let selected = [];
        if (multi || chkbox || multiClick) {
            if (event.shiftKey) {
                selected = selectRowsBetween([], this.rows, index, this.prevIndex, this.getRowSelectedIdx.bind(this));
            }
            else if (event.ctrlKey || event.metaKey || multiClick || chkbox) {
                selected = selectRows([...this.selected], row, this.getRowSelectedIdx.bind(this));
            }
            else {
                selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
            }
        }
        else {
            selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
        }
        if (typeof this.selectCheck === 'function') {
            selected = selected.filter(this.selectCheck.bind(this));
        }
        if (typeof this.disableCheck === 'function') {
            selected = selected.filter(rowData => !this.disableCheck(rowData));
        }
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        this.prevIndex = index;
        this.select.emit({
            selected
        });
    }
    onActivate(model, index) {
        const { type, event, row } = model;
        const chkbox = this.selectionType === SelectionType.checkbox;
        const select = (!chkbox && (type === 'click' || type === 'dblclick')) || (chkbox && type === 'checkbox');
        if (select) {
            this.selectRow(event, index, row);
        }
        else if (type === 'keydown') {
            if (event.keyCode === Keys.return) {
                this.selectRow(event, index, row);
            }
            else {
                this.onKeyboardFocus(model);
            }
        }
        this.activate.emit(model);
    }
    onKeyboardFocus(model) {
        const { keyCode } = model.event;
        const shouldFocus = keyCode === Keys.up || keyCode === Keys.down || keyCode === Keys.right || keyCode === Keys.left;
        if (shouldFocus) {
            const isCellSelection = this.selectionType === SelectionType.cell;
            if (typeof this.disableCheck === 'function') {
                const isRowDisabled = this.disableCheck(model.row);
                if (isRowDisabled) {
                    return;
                }
            }
            if (!model.cellElement || !isCellSelection) {
                this.focusRow(model.rowElement, keyCode);
            }
            else if (isCellSelection) {
                this.focusCell(model.cellElement, model.rowElement, keyCode, model.cellIndex);
            }
        }
    }
    focusRow(rowElement, keyCode) {
        const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
        if (nextRowElement) {
            nextRowElement.focus();
        }
    }
    getPrevNextRow(rowElement, keyCode) {
        const parentElement = rowElement.parentElement;
        if (parentElement) {
            let focusElement;
            if (keyCode === Keys.up) {
                focusElement = parentElement.previousElementSibling;
            }
            else if (keyCode === Keys.down) {
                focusElement = parentElement.nextElementSibling;
            }
            if (focusElement && focusElement.children.length) {
                return focusElement.children[0];
            }
        }
    }
    focusCell(cellElement, rowElement, keyCode, cellIndex) {
        let nextCellElement;
        if (keyCode === Keys.left) {
            nextCellElement = cellElement.previousElementSibling;
        }
        else if (keyCode === Keys.right) {
            nextCellElement = cellElement.nextElementSibling;
        }
        else if (keyCode === Keys.up || keyCode === Keys.down) {
            const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
            if (nextRowElement) {
                const children = nextRowElement.getElementsByClassName('datatable-body-cell');
                if (children.length) {
                    nextCellElement = children[cellIndex];
                }
            }
        }
        if (nextCellElement) {
            nextCellElement.focus();
        }
    }
    getRowSelected(row) {
        return this.getRowSelectedIdx(row, this.selected) > -1;
    }
    getRowSelectedIdx(row, selected) {
        if (!selected || !selected.length) {
            return -1;
        }
        const rowId = this.rowIdentity(row);
        return selected.findIndex(r => {
            const id = this.rowIdentity(r);
            return id === rowId;
        });
    }
}
DataTableSelectionComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: DataTableSelectionComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
DataTableSelectionComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.9", type: DataTableSelectionComponent, selector: "datatable-selection", inputs: { rows: "rows", selected: "selected", selectEnabled: "selectEnabled", selectionType: "selectionType", rowIdentity: "rowIdentity", selectCheck: "selectCheck", disableCheck: "disableCheck" }, outputs: { activate: "activate", select: "select" }, ngImport: i0, template: ` <ng-content></ng-content> `, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: DataTableSelectionComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'datatable-selection',
                    template: ` <ng-content></ng-content> `,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], propDecorators: { rows: [{
                type: Input
            }], selected: [{
                type: Input
            }], selectEnabled: [{
                type: Input
            }], selectionType: [{
                type: Input
            }], rowIdentity: [{
                type: Input
            }], selectCheck: [{
                type: Input
            }], disableCheck: [{
                type: Input
            }], activate: [{
                type: Output
            }], select: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1kYXRhdGFibGUvc3JjL2xpYi9jb21wb25lbnRzL2JvZHkvc2VsZWN0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDdEUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDOztBQWdCeEMsTUFBTSxPQUFPLDJCQUEyQjtJQUx4QztRQWNZLGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqRCxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7S0FvSTFEO0lBaElDLFNBQVMsQ0FBQyxLQUFpQyxFQUFFLEtBQWEsRUFBRSxHQUFRO1FBQ2xFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQUMsT0FBTztTQUFDO1FBRWxDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssYUFBYSxDQUFDLFFBQVEsQ0FBQztRQUM3RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDekQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsVUFBVSxDQUFDO1FBQ25FLElBQUksUUFBUSxHQUFVLEVBQUUsQ0FBQztRQUV6QixJQUFJLEtBQUssSUFBSSxNQUFNLElBQUksVUFBVSxFQUFFO1lBQ2pDLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsUUFBUSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUN2RztpQkFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxVQUFVLElBQUksTUFBTSxFQUFFO2dCQUNqRSxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNuRjtpQkFBTTtnQkFDTCxRQUFRLEdBQUcsVUFBVSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ25FO1NBQ0Y7YUFBTTtZQUNMLFFBQVEsR0FBRyxVQUFVLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDbkU7UUFFRCxJQUFJLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxVQUFVLEVBQUU7WUFDMUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksT0FBTyxJQUFJLENBQUMsWUFBWSxLQUFLLFVBQVUsRUFBRTtZQUMzQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ3BFO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztRQUVoQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUV2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLFFBQVE7U0FDVCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQVksRUFBRSxLQUFhO1FBQ3BDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUNuQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDN0QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksSUFBSSxLQUFLLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxLQUFLLFVBQVUsQ0FBQyxDQUFDO1FBRXpHLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ25DO2FBQU0sSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQzdCLElBQUssS0FBdUIsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDN0I7U0FDRjtRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxlQUFlLENBQUMsS0FBWTtRQUMxQixNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQXNCLENBQUM7UUFDakQsTUFBTSxXQUFXLEdBQUcsT0FBTyxLQUFLLElBQUksQ0FBQyxFQUFFLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFcEgsSUFBSSxXQUFXLEVBQUU7WUFDZixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLGFBQWEsQ0FBQyxJQUFJLENBQUM7WUFDbEUsSUFBSSxPQUFPLElBQUksQ0FBQyxZQUFZLEtBQUssVUFBVSxFQUFFO2dCQUMzQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxhQUFhLEVBQUU7b0JBQ2pCLE9BQU87aUJBQ1I7YUFDRjtZQUNELElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUMxQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDMUM7aUJBQU0sSUFBSSxlQUFlLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDL0U7U0FDRjtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsVUFBZSxFQUFFLE9BQWU7UUFDdkMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEUsSUFBSSxjQUFjLEVBQUU7WUFBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7U0FBQztJQUMvQyxDQUFDO0lBRUQsY0FBYyxDQUFDLFVBQWUsRUFBRSxPQUFlO1FBQzdDLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFFL0MsSUFBSSxhQUFhLEVBQUU7WUFDakIsSUFBSSxZQUF5QixDQUFDO1lBQzlCLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZCLFlBQVksR0FBRyxhQUFhLENBQUMsc0JBQXNCLENBQUM7YUFDckQ7aUJBQU0sSUFBSSxPQUFPLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDaEMsWUFBWSxHQUFHLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQzthQUNqRDtZQUVELElBQUksWUFBWSxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO2dCQUNoRCxPQUFPLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDakM7U0FDRjtJQUNILENBQUM7SUFFRCxTQUFTLENBQUMsV0FBZ0IsRUFBRSxVQUFlLEVBQUUsT0FBZSxFQUFFLFNBQWlCO1FBQzdFLElBQUksZUFBNEIsQ0FBQztRQUVqQyxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ3pCLGVBQWUsR0FBRyxXQUFXLENBQUMsc0JBQXNCLENBQUM7U0FDdEQ7YUFBTSxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2pDLGVBQWUsR0FBRyxXQUFXLENBQUMsa0JBQWtCLENBQUM7U0FDbEQ7YUFBTSxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsRUFBRSxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ3ZELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hFLElBQUksY0FBYyxFQUFFO2dCQUNsQixNQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsc0JBQXNCLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDOUUsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO29CQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQUM7YUFDOUQ7U0FDRjtRQUVELElBQUksZUFBZSxFQUFFO1lBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQUM7SUFDakQsQ0FBQztJQUVELGNBQWMsQ0FBQyxHQUFRO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELGlCQUFpQixDQUFDLEdBQVEsRUFBRSxRQUFlO1FBQ3pDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUFDO1FBRS9DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsT0FBTyxFQUFFLEtBQUssS0FBSyxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7d0hBN0lVLDJCQUEyQjs0R0FBM0IsMkJBQTJCLHNUQUg1Qiw2QkFBNkI7MkZBRzVCLDJCQUEyQjtrQkFMdkMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixRQUFRLEVBQUUsNkJBQTZCO29CQUN2QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtpQkFDaEQ7OEJBRVUsSUFBSTtzQkFBWixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVJLFFBQVE7c0JBQWpCLE1BQU07Z0JBQ0csTUFBTTtzQkFBZixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvc2VsZWN0aW9uLnR5cGUnO1xuaW1wb3J0IHsgc2VsZWN0Um93cywgc2VsZWN0Um93c0JldHdlZW4gfSBmcm9tICcuLi8uLi91dGlscy9zZWxlY3Rpb24nO1xuaW1wb3J0IHsgS2V5cyB9IGZyb20gJy4uLy4uL3V0aWxzL2tleXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1vZGVsIHtcbiAgdHlwZTogc3RyaW5nO1xuICBldmVudDogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQ7XG4gIHJvdzogYW55O1xuICByb3dFbGVtZW50OiBhbnk7XG4gIGNlbGxFbGVtZW50OiBhbnk7XG4gIGNlbGxJbmRleDogbnVtYmVyO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkYXRhdGFibGUtc2VsZWN0aW9uJyxcbiAgdGVtcGxhdGU6IGAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PiBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVTZWxlY3Rpb25Db21wb25lbnQge1xuICBASW5wdXQoKSByb3dzOiBhbnlbXTtcbiAgQElucHV0KCkgc2VsZWN0ZWQ6IGFueVtdO1xuICBASW5wdXQoKSBzZWxlY3RFbmFibGVkOiBib29sZWFuO1xuICBASW5wdXQoKSBzZWxlY3Rpb25UeXBlOiBTZWxlY3Rpb25UeXBlO1xuICBASW5wdXQoKSByb3dJZGVudGl0eTogYW55O1xuICBASW5wdXQoKSBzZWxlY3RDaGVjazogYW55O1xuICBASW5wdXQoKSBkaXNhYmxlQ2hlY2s6IGFueTtcblxuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcmV2SW5kZXg6IG51bWJlcjtcblxuICBzZWxlY3RSb3coZXZlbnQ6IEtleWJvYXJkRXZlbnQgfCBNb3VzZUV2ZW50LCBpbmRleDogbnVtYmVyLCByb3c6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zZWxlY3RFbmFibGVkKSB7cmV0dXJuO31cblxuICAgIGNvbnN0IGNoa2JveCA9IHRoaXMuc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5jaGVja2JveDtcbiAgICBjb25zdCBtdWx0aSA9IHRoaXMuc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5tdWx0aTtcbiAgICBjb25zdCBtdWx0aUNsaWNrID0gdGhpcy5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLm11bHRpQ2xpY2s7XG4gICAgbGV0IHNlbGVjdGVkOiBhbnlbXSA9IFtdO1xuXG4gICAgaWYgKG11bHRpIHx8IGNoa2JveCB8fCBtdWx0aUNsaWNrKSB7XG4gICAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgc2VsZWN0ZWQgPSBzZWxlY3RSb3dzQmV0d2VlbihbXSwgdGhpcy5yb3dzLCBpbmRleCwgdGhpcy5wcmV2SW5kZXgsIHRoaXMuZ2V0Um93U2VsZWN0ZWRJZHguYmluZCh0aGlzKSk7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSB8fCBtdWx0aUNsaWNrIHx8IGNoa2JveCkge1xuICAgICAgICBzZWxlY3RlZCA9IHNlbGVjdFJvd3MoWy4uLnRoaXMuc2VsZWN0ZWRdLCByb3csIHRoaXMuZ2V0Um93U2VsZWN0ZWRJZHguYmluZCh0aGlzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxlY3RlZCA9IHNlbGVjdFJvd3MoW10sIHJvdywgdGhpcy5nZXRSb3dTZWxlY3RlZElkeC5iaW5kKHRoaXMpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0ZWQgPSBzZWxlY3RSb3dzKFtdLCByb3csIHRoaXMuZ2V0Um93U2VsZWN0ZWRJZHguYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnNlbGVjdENoZWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBzZWxlY3RlZCA9IHNlbGVjdGVkLmZpbHRlcih0aGlzLnNlbGVjdENoZWNrLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5kaXNhYmxlQ2hlY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHNlbGVjdGVkID0gc2VsZWN0ZWQuZmlsdGVyKHJvd0RhdGEgPT4gIXRoaXMuZGlzYWJsZUNoZWNrKHJvd0RhdGEpKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGVkLnNwbGljZSgwLCB0aGlzLnNlbGVjdGVkLmxlbmd0aCk7XG4gICAgdGhpcy5zZWxlY3RlZC5wdXNoKC4uLnNlbGVjdGVkKTtcblxuICAgIHRoaXMucHJldkluZGV4ID0gaW5kZXg7XG5cbiAgICB0aGlzLnNlbGVjdC5lbWl0KHtcbiAgICAgIHNlbGVjdGVkXG4gICAgfSk7XG4gIH1cblxuICBvbkFjdGl2YXRlKG1vZGVsOiBNb2RlbCwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHsgdHlwZSwgZXZlbnQsIHJvdyB9ID0gbW9kZWw7XG4gICAgY29uc3QgY2hrYm94ID0gdGhpcy5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLmNoZWNrYm94O1xuICAgIGNvbnN0IHNlbGVjdCA9ICghY2hrYm94ICYmICh0eXBlID09PSAnY2xpY2snIHx8IHR5cGUgPT09ICdkYmxjbGljaycpKSB8fCAoY2hrYm94ICYmIHR5cGUgPT09ICdjaGVja2JveCcpO1xuXG4gICAgaWYgKHNlbGVjdCkge1xuICAgICAgdGhpcy5zZWxlY3RSb3coZXZlbnQsIGluZGV4LCByb3cpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2tleWRvd24nKSB7XG4gICAgICBpZiAoKGV2ZW50IGFzIEtleWJvYXJkRXZlbnQpLmtleUNvZGUgPT09IEtleXMucmV0dXJuKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0Um93KGV2ZW50LCBpbmRleCwgcm93KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25LZXlib2FyZEZvY3VzKG1vZGVsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KG1vZGVsKTtcbiAgfVxuXG4gIG9uS2V5Ym9hcmRGb2N1cyhtb2RlbDogTW9kZWwpOiB2b2lkIHtcbiAgICBjb25zdCB7IGtleUNvZGUgfSA9IG1vZGVsLmV2ZW50IGFzIEtleWJvYXJkRXZlbnQ7XG4gICAgY29uc3Qgc2hvdWxkRm9jdXMgPSBrZXlDb2RlID09PSBLZXlzLnVwIHx8IGtleUNvZGUgPT09IEtleXMuZG93biB8fCBrZXlDb2RlID09PSBLZXlzLnJpZ2h0IHx8IGtleUNvZGUgPT09IEtleXMubGVmdDtcblxuICAgIGlmIChzaG91bGRGb2N1cykge1xuICAgICAgY29uc3QgaXNDZWxsU2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLmNlbGw7XG4gICAgICBpZiAodHlwZW9mIHRoaXMuZGlzYWJsZUNoZWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGlzUm93RGlzYWJsZWQgPSB0aGlzLmRpc2FibGVDaGVjayhtb2RlbC5yb3cpO1xuICAgICAgICBpZiAoaXNSb3dEaXNhYmxlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFtb2RlbC5jZWxsRWxlbWVudCB8fCAhaXNDZWxsU2VsZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZm9jdXNSb3cobW9kZWwucm93RWxlbWVudCwga2V5Q29kZSk7XG4gICAgICB9IGVsc2UgaWYgKGlzQ2VsbFNlbGVjdGlvbikge1xuICAgICAgICB0aGlzLmZvY3VzQ2VsbChtb2RlbC5jZWxsRWxlbWVudCwgbW9kZWwucm93RWxlbWVudCwga2V5Q29kZSwgbW9kZWwuY2VsbEluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb2N1c1Jvdyhyb3dFbGVtZW50OiBhbnksIGtleUNvZGU6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IG5leHRSb3dFbGVtZW50ID0gdGhpcy5nZXRQcmV2TmV4dFJvdyhyb3dFbGVtZW50LCBrZXlDb2RlKTtcbiAgICBpZiAobmV4dFJvd0VsZW1lbnQpIHtuZXh0Um93RWxlbWVudC5mb2N1cygpO31cbiAgfVxuXG4gIGdldFByZXZOZXh0Um93KHJvd0VsZW1lbnQ6IGFueSwga2V5Q29kZTogbnVtYmVyKTogYW55IHtcbiAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gcm93RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXG4gICAgaWYgKHBhcmVudEVsZW1lbnQpIHtcbiAgICAgIGxldCBmb2N1c0VsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgICAgaWYgKGtleUNvZGUgPT09IEtleXMudXApIHtcbiAgICAgICAgZm9jdXNFbGVtZW50ID0gcGFyZW50RWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgfSBlbHNlIGlmIChrZXlDb2RlID09PSBLZXlzLmRvd24pIHtcbiAgICAgICAgZm9jdXNFbGVtZW50ID0gcGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChmb2N1c0VsZW1lbnQgJiYgZm9jdXNFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZm9jdXNFbGVtZW50LmNoaWxkcmVuWzBdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvY3VzQ2VsbChjZWxsRWxlbWVudDogYW55LCByb3dFbGVtZW50OiBhbnksIGtleUNvZGU6IG51bWJlciwgY2VsbEluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBsZXQgbmV4dENlbGxFbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAgIGlmIChrZXlDb2RlID09PSBLZXlzLmxlZnQpIHtcbiAgICAgIG5leHRDZWxsRWxlbWVudCA9IGNlbGxFbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgfSBlbHNlIGlmIChrZXlDb2RlID09PSBLZXlzLnJpZ2h0KSB7XG4gICAgICBuZXh0Q2VsbEVsZW1lbnQgPSBjZWxsRWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgfSBlbHNlIGlmIChrZXlDb2RlID09PSBLZXlzLnVwIHx8IGtleUNvZGUgPT09IEtleXMuZG93bikge1xuICAgICAgY29uc3QgbmV4dFJvd0VsZW1lbnQgPSB0aGlzLmdldFByZXZOZXh0Um93KHJvd0VsZW1lbnQsIGtleUNvZGUpO1xuICAgICAgaWYgKG5leHRSb3dFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gbmV4dFJvd0VsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGF0YXRhYmxlLWJvZHktY2VsbCcpO1xuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoKSB7bmV4dENlbGxFbGVtZW50ID0gY2hpbGRyZW5bY2VsbEluZGV4XTt9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5leHRDZWxsRWxlbWVudCkge25leHRDZWxsRWxlbWVudC5mb2N1cygpO31cbiAgfVxuXG4gIGdldFJvd1NlbGVjdGVkKHJvdzogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Um93U2VsZWN0ZWRJZHgocm93LCB0aGlzLnNlbGVjdGVkKSA+IC0xO1xuICB9XG5cbiAgZ2V0Um93U2VsZWN0ZWRJZHgocm93OiBhbnksIHNlbGVjdGVkOiBhbnlbXSk6IG51bWJlciB7XG4gICAgaWYgKCFzZWxlY3RlZCB8fCAhc2VsZWN0ZWQubGVuZ3RoKSB7cmV0dXJuIC0xO31cblxuICAgIGNvbnN0IHJvd0lkID0gdGhpcy5yb3dJZGVudGl0eShyb3cpO1xuICAgIHJldHVybiBzZWxlY3RlZC5maW5kSW5kZXgociA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMucm93SWRlbnRpdHkocik7XG4gICAgICByZXR1cm4gaWQgPT09IHJvd0lkO1xuICAgIH0pO1xuICB9XG59XG4iXX0=